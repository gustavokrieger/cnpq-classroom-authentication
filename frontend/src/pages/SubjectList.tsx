import "./SubjectList.css";
import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import ConfirmationModal from "../components/ConfirmationModal";

interface Lecture {
  course: string;
  is_ongoing: boolean;
}

export default function SubjectList(): JSX.Element {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lectures, setLectures] = useState<readonly Lecture[]>([]);

  useEffect(() => {
    (async () => {
      const init = {
        headers: {
          Authorization: "Token f1889b9a70431f0c285230272163af0a61d2916e",
        },
      };
      const response = await fetch("http://127.0.0.1:8000/api/lectures/", init);
      setLectures(await response.json());
    })();
  }, []);

  const handleConfirmationAccept = () => {
    setShowConfirmation(false);
    // TODO: make request here.
  };

  const ListGroupItems = lectures.map((v, i) => (
    <ListGroup.Item
      className="list-group__item"
      key={i}
      action
      onClick={() => setShowConfirmation(true)}
      disabled={!v.is_ongoing}
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
