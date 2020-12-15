const arr_delete = "delete";
const arr_create = "create";
const arr_update = "update";
const arr_del_up = "del_up"; //! when item have update status then delete

export const action = {
  create: arr_create,
  delete: arr_delete,
  update: arr_update,
  del_up: arr_del_up,
};
export const change = (
  action,
  itemChanged,
  arrChanged,
  key1 = "id",
  key2 = "id"
) => {
  const arr = [...arrChanged];
  let item = { ...itemChanged };
  let index = arrChanged.findIndex((ele) => ele[key2] === itemChanged[key1]);
  switch (action) {
    case arr_create:
      if (index === -1) {
        //* create 1 item not exist in arr changed
        //* add to arr changed with status create and return this
        arr.push({ ...item, action: arr_create });
      } else if (arr[index].action === arr_update) {
        //* create 1 item exist in arr changed with update status
        //* change status to create and return
        //* mey be never happen
        item.action = arr_create;
        arr[index] = item;
      } else if (arr[index].action === arr_del_up) {
        item = arr[index];
        item.action = arr_update;
        arr[index] = item;
      } else if (arr[index].action === arr_delete) {
        //* create 1 item exist in arr changed with delete status
        //* remove from arr changed and return this
        item = arr.splice(index, 1)[0];
      }
      break;
    case arr_delete:
      if (index === -1) {
        //* delete 1 item not exist in arr changed
        //* add to arr changed with status delete and return this
        arr.push({ ...item, action: arr_delete });
      } else if (arr[index].action === arr_update) {
        //* delete 1 item exist in arr changed with update status
        //* change status to delete return this
        item.action = arr_del_up;
        arr[index] = item;
      } else if (arr[index].action === arr_create) {
        //* delete 1 item exist in arr changed with create status
        //* remove from arr changed and return this
        item = arr.splice(index, 1)[0];
      }
      break;
    case arr_update:
      if (index === -1) {
        //* update 1 item not exist in arr changed
        //* add to arr changed with status update and return this
        arr.push({ ...item, action: arr_update });
      } else if (arr[index].action === arr_update) {
        item.action = arr_update;
        arr[index] = item;
      } else if (arr[index].action === arr_create) {
        //* update 1 item exist in arr changed with create status
        //* update state, not update status
        item.action = arr_create;
        arr[index] = item;
      } else {
        //* update 1 item exist in arr changed with delete status
        //* change status to update and return this
        //* may be never happen
        item.action = arr_update;
        arr[index] = item;
      }
      break;
    default:
      break;
  }

  return [arr, item];
};
