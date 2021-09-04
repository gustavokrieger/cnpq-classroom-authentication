import "./Courses.css";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ConfirmationModal from "../components/ConfirmationModal";
import { attendLecture, loadLectures } from "../utils/backend";
import Toast from "react-bootstrap/Toast";
import { DEFAULT_OPTIONS } from "../utils/geolocation";
import { getAndRegisterPosition } from "../utils/general";
import Button from "react-bootstrap/Button";

interface Lecture {
  id: number;
  course: string;
  start: string;
  end: string;
  is_ongoing: boolean;
}

export default function Courses(): JSX.Element {
  const history = useHistory();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lectures, setLectures] = useState<readonly Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState(0);
  const [attendingLectureId, setAttendingLectureId] = useState(0);

  // TODO: maybe add back later.
  // useEffect(() => {
  //   window.addEventListener("beforeunload", (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   });
  // }, []);

  const unauthorizedRedirect = useCallback(
    (response: Response) => {
      if (response.status === 403) {
        history.push("/desautorizado");
      }
    },
    [history]
  );

  useEffect(() => {
    const getAndRegisterPositionDefault = async () => {
      const response = await getAndRegisterPosition(DEFAULT_OPTIONS);
      unauthorizedRedirect(response);
    };

    getAndRegisterPositionDefault();
    const interval = setInterval(getAndRegisterPositionDefault, 60 * 1_000);
    return () => clearInterval(interval);
  }, [unauthorizedRedirect]);

  useEffect(() => {
    (async () => {
      const response = await loadLectures();
      unauthorizedRedirect(response);
      setLectures(await response.json());
    })();
  }, [unauthorizedRedirect]);

  useEffect(() => {
    if (!attendingLectureId) {
      return;
    }

    const interval = setInterval(async () => {
      const response = await attendLecture(attendingLectureId);
      unauthorizedRedirect(response);
      setShowToast(true);
    }, 6_000);

    return () => clearInterval(interval);
  }, [attendingLectureId, unauthorizedRedirect]);

  const handleConfirmationAccept = async () => {
    setShowConfirmation(false);
    setAttendingLectureId(selectedLectureId);
  };

  const getListGroupProps = (lecture: Lecture) => {
    if (lecture.id === attendingLectureId) {
      return {
        variant: "success",
      };
    }
    if (lecture.is_ongoing) {
      return {
        action: true,
        onClick: () => handleListGroupItemClick(lecture.id),
        active: true,
      };
    }
    return {};
  };

  const handleListGroupItemClick = (lectureId: number) => {
    setShowConfirmation(true);
    setSelectedLectureId(lectureId);
  };

  const removeSeconds = (time: string) => time.slice(0, -3);

  const listGroupItems = lectures.map((v, i) => (
    <ListGroup.Item key={i} {...getListGroupProps(v)}>
      <span className="list-group__text list-group__text_left">{v.course}</span>
      <span className="list-group__text list-group__text_right">
        {`${removeSeconds(v.start)} até ${removeSeconds(v.end)}`}
      </span>
    </ListGroup.Item>
  ));

  return (
    <>
      <h1 className="title-heading">registro de presença</h1>
      {lectures.length === 0 ? (
        <h5 className="list-heading text-muted">
          não há aulas para registrar presença.
        </h5>
      ) : (
        <>
          <h5 className="list-heading text-muted">
            selecione aula para começar a registrar presença.
          </h5>
          <ListGroup className="list-group">{listGroupItems}</ListGroup>
        </>
      )}
      {/*TODO: remove button.*/}
      <Button
        onClick={() =>
          window.location.replace(
            "https://sp-implicit.cafeexpresso.rnp.br/saml2/login" +
              "/?next=https://sp-implicit.cafeexpresso.rnp.br" +
              "&idp=https://idp-implicit.cafeexpresso.rnp.br/idp/shibboleth"
          )
        }
      >
        redirect
      </Button>
      <ConfirmationModal
        title="confirmação"
        body="sua presença começará a ser registrada.
        Depois de confirmar, mantenha esta aba do browser aberta."
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleAccept={handleConfirmationAccept}
      />
      <Toast
        className="attended-toast"
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={4_000}
        autohide
      >
        <Toast.Header className="attended-toast__header" closeButton={false}>
          <strong>aviso</strong>
        </Toast.Header>
        <Toast.Body className="attended-toast__body">
          sua presença na aula foi registrada.
        </Toast.Body>
      </Toast>
    </>
  );
}
