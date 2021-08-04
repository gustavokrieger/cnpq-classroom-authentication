import "./SubjectList.css";
import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import ConfirmationModal from "../components/ConfirmationModal";

interface Lecture {
  id: number;
  course: string;
  is_ongoing: boolean;
  has_attended: boolean;
}

export default function SubjectList(): JSX.Element {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lectures, setLectures] = useState<readonly Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState(0);

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    const init = {
      // headers: {
      //   Authorization: "Token 96558d56f429188c4ba843bec4d53f8391cacf0a",
      // },
    };
    const response = await fetch(
      `http://${process.env.DOMAIN}:${process.env.BACKEND_HOST_PORT}/api/lectures/today/`,
      init
    );
    setLectures(await response.json());
  };

  const handleConfirmationAccept = async () => {
    setShowConfirmation(false);
    await attendLecture();
    await loadLectures();
  };

  const attendLecture = async () => {
    const init = {
      method: "POST",
      // headers: {
      //   Authorization: "Token 96558d56f429188c4ba843bec4d53f8391cacf0a",
      // },
    };
    await fetch(
      `http://${process.env.DOMAIN}:${process.env.BACKEND_HOST_PORT}/api/lectures/${selectedLectureId}/attend/`,
      init
    );
  };

  const getListGroupProps = (lecture: Lecture) => {
    if (lecture.has_attended) {
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

  const listGroupItems = lectures.map((v, i) => (
    <ListGroup.Item
      className="list-group__item"
      key={i}
      {...getListGroupProps(v)}
    >
      {v.course}
    </ListGroup.Item>
  ));

  return (
    <>
      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleAccept={handleConfirmationAccept}
      />
      <Container className="container">
        <h1 className="title-heading">registro de presença</h1>
        <h5 className="list-heading text-muted">
          selecione disciplina para registrar presença.
        </h5>
        <ListGroup className="list-group">{listGroupItems}</ListGroup>
      </Container>
    </>
  );
}
