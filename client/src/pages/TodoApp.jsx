import { useEffect, useState } from "react";
import ListItem from "../components/ListItem";
import HolidayIcon from "../images/HolidayIcon.svg";
import Modal from "../components/Modal";
import { useCookies } from "react-cookie";

const TodoApp = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${cookies.Email}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewButton = (e) => {
    e.preventDefault();
    setShowModal(true);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSignOut = (e) => {
    e.preventDefault();
    removeCookie("Email");
    removeCookie("AuthToken");
    window.location.reload();
  };

  const tasksSortedByDate = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      <div className="todo-container">
        <div className="list-header-container">
          <div className="list-header-title-container">
            <img src={HolidayIcon} alt="Holiday Icon" />
            <h2>To-do list app</h2>
          </div>
          <div className="buttons-container">
            <button onClick={addNewButton}>ADD NEW</button>
            <button onClick={handleSignOut}>SIGN OUT</button>
          </div>
        </div>
        <div className="list-items-container">
          <p className="welcome-message">Welcome back {cookies.Email}</p>
          {tasksSortedByDate?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
          <p>© github/taha0998</p>
        </div>
      </div>
      {showModal && (
        <Modal mode="create" setShowModal={setShowModal} getData={getData} />
      )}
    </>
  );
};

export default TodoApp;
