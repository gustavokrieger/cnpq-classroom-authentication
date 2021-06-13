import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

// TODO: after it's done, add it to the app.

export default function Home(): JSX.Element {
  function alertClicked() {
    alert("You clicked the third ListGroupItem");
  }

  const items = [
    { subject: "materia-1", disabled: true },
    { subject: "materia-2", disabled: false },
    { subject: "materia-3", disabled: true },
  ];

  const ListGroupItems = items.map((value, index) => (
    <ListGroup.Item key={index} disabled={value.disabled}>
      {value.subject}
      <Button onClick={alertClicked} disabled={value.disabled}>
        alo
      </Button>
    </ListGroup.Item>
  ));

  return (
    <>
      <h1>login realizado com sucesso</h1>
      <p>email do usuário: xxxxx</p>
      <ListGroup>{ListGroupItems}</ListGroup>
    </>
  );
}
