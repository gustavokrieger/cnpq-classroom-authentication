import "./ConfirmationModal.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface Props {
  show: boolean;
  handleClose: () => void;
  handleAccept: () => void;
}

export default function ConfirmationModal(props: Props): JSX.Element {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="modal__title">confirmação</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal__body">
        esta ação irá registar sua presença
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="modal__button"
          variant="secondary"
          onClick={props.handleClose}
        >
          cancelar
        </Button>
        <Button
          className="modal__button"
          variant="primary"
          onClick={props.handleAccept}
        >
          confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
