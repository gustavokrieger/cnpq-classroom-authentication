import "./SubjectList.css";
import ListGroup from "react-bootstrap/ListGroup";
import { Container } from "react-bootstrap";

export default function SubjectList(): JSX.Element {
  function alertClicked() {
    alert("You clicked the third ListGroupItem");
  }

  const items = [
    { subject: "materia 1", disabled: true },
    { subject: "materia 2", disabled: false },
    { subject: "materia 3", disabled: true },
  ];

  const ListGroupItems = items.map((value, index) => (
    <ListGroup.Item
      className="list-group__item"
      key={index}
      action
      onClick={alertClicked}
      disabled={value.disabled}
    >
      {value.subject}
    </ListGroup.Item>
  ));

  return (
    <>
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