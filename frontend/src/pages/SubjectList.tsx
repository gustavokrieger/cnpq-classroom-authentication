import "./SubjectList.css";
import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import ConfirmationModal from "../components/ConfirmationModal";

interface Lecture {
  course: string;
  is_ongoing: boolean;
  has_registered_today: boolean;
}

export default function SubjectList(): JSX.Element {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lectures, setLectures] = useState<readonly Lecture[]>([]);

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    const init = {
      headers: {
        Authorization: "Token 97a17b6999bb1c0a9cb5b6da2461850a76455624",
      },
    };
    const response = await fetch(
      "http://127.0.0.1:8000/api/lectures/today/",
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
      headers: {
        Authorization: "Token 97a17b6999bb1c0a9cb5b6da2461850a76455624",
      },
    };
    await fetch("http://127.0.0.1:8000/api/lectures/2/attend/", init);
  };

  const getListGroupProps = (lecture: Lecture) => {
    if (lecture.has_registered_today) {
      return {
        variant: "success",
      };
    }
    if (lecture.is_ongoing) {
      return {
        action: true,
        onClick: () => setShowConfirmation(true),
        active: true,
      };
    }
    return {};
  };

  const ListGroupItems = lectures.map((v, i) => (
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
        <ListGroup className="list-group">{ListGroupItems}</ListGroup>
      </Container>
    </>
  );
}
