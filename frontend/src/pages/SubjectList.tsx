import "./SubjectList.css";
import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ConfirmationModal from "../components/ConfirmationModal";
import { attendLecture, loadLectures } from "../external/backend";
import Toast from "react-bootstrap/Toast";

interface Lecture {
  id: number;
  course: string;
  start: string;
  end: string;
  is_ongoing: boolean;
}

export default function SubjectList(): JSX.Element {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lectures, setLectures] = useState<readonly Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState(0);
  const [attendingLectureId, setAttendingLectureId] = useState(0);

  useEffect(() => {
    loadAndSetLectures();
  }, []);

  useEffect(() => {
    if (!attendingLectureId) {
      return;
    }

    const interval = setInterval(() => {
      attendLecture(attendingLectureId);
      setShowToast(true);
    }, 5_000);

    return () => clearInterval(interval);
  }, [attendingLectureId]);

  const loadAndSetLectures = async () => {
    const response = await loadLectures();
    setLectures(await response.json());
  };

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
      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleAccept={handleConfirmationAccept}
      />
      <Toast
        className="attended-toast"
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3_000}
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
