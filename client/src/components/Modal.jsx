import { useState } from "react";
import { useCookies } from "react-cookie";

const Modal = ({ task, mode, setShowModal, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;
  const [data, setData] = useState({
    email: task?.email ? task.email : cookies.Email,
    title: task?.title ? task.title : "",
    progress: task?.progress ? task.progress : 20,
    date: task?.date ? task.date : new Date(),
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${task?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <form
        className="modal-container"
        onSubmit={editMode ? handleEdit : handleAdd}
      >
        <h2 className="modal-title">Let's {mode} your task!</h2>
        <div className="task-title-input">
          <input
            placeholder="Your task goes here"
            name="title"
            value={data.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="task-progress-container">
          <label htmlFor="progress">Drag to select your current progress</label>
          <div className="task-progress-range-container">
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              value={data.progress}
              onChange={handleChange}
              style={{ "--progress": `${data.progress}%` }}
            />
            <p>{data.progress}%</p>
          </div>
        </div>

        <button type="submit" className="submit-button">
          SUBMIT
        </button>
        <p className="close-button" onClick={() => setShowModal(false)}>
          x
        </p>
      </form>
      <div className="modal-close" onClick={() => setShowModal(false)}></div>
    </div>
  );
};

export default Modal;
