import "./ui.css";

const Modal = ({
  open,
  children,
}) => {

  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        {children}

      </div>

    </div>
  );
};

export default Modal;