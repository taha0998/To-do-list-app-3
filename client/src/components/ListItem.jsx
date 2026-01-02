import { useEffect, useState } from "react";
import checkSVG from "../images/checkSVG.svg";
import Modal from "./Modal";

const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false);
  // const [title, setTitle] = useState(task.title);

  const editButton = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const fixedTitle = (title) => {
    if (title.length >= 15) {
      const fixedTitle = `${title.slice(0, 16)}...`;
      return fixedTitle;
    }else {
      return title
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const id = task.id;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="list-item-container">
        <div className="task-title">
          <img src={checkSVG} alt="check Icon" />
          <h3>{fixedTitle(task.title)}</h3>
        </div>
        <div className="task-params">
          <div className="progress-container">
            <p>{task.progress}%</p>
            <div className="progress-box-container">
              <div
                className="progress-top"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="buttons-container">
            <button onClick={editButton}>EDIT</button>
            <button onClick={handleDelete}>DELETE</button>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          task={task}
          setShowModal={setShowModal}
          getData={getData}
        />
      )}
    </>
  );
};
export default ListItem;
