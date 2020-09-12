import {
  FETCH_TASKS_FAIL,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_START,
  SELECT_TASK,
} from "./actionType";
import timeCloudAPI from "../../apis/timeCloudAPI";

export const startFetchTasks = () => {
  return {
    type: FETCH_TASKS_START,
  };
};

export const fetchTasksSuccess = (tasks) => {
  return {
    type: FETCH_TASKS_SUCCESS,
    payload: tasks,
  };
};

export const fetchTasksFail = (errorMassage) => {
  return {
    type: FETCH_TASKS_FAIL,
    payload: errorMassage,
  };
};

export const fetchTasks = (projectId) => {
  return async (dispatch) => {
    const response = await timeCloudAPI.get(`projects/${projectId}/tasks`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZhbmhpZXAwMCIsImlhdCI6MTU5OTcyMTI3NSwiZXhwIjoxNjAwNTg1Mjc1fQ.3F9ZfEa3jJ5IV-hex3YXPzjzDOy2UOCHOsfqvxBq05w",
      },
    });
    dispatch(fetchTasksSuccess(response.data));
  };
};

export const fetchTask = (taskId) => {
  return async (dispatch) => {
    try {
      const response = await timeCloudAPI.get(`tasks/${taskId}`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZhbmhpZXAwMCIsImlhdCI6MTU5OTcyMTI3NSwiZXhwIjoxNjAwNTg1Mjc1fQ.3F9ZfEa3jJ5IV-hex3YXPzjzDOy2UOCHOsfqvxBq05w",
        },
      });
      dispatch(selectTask(response.data));
    } catch (error) {}
  };
};

export const selectTask = (task) => {
  return {
    type: SELECT_TASK,
    payload: task,
  };
};
