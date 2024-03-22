import React, { useEffect, useState } from "react";
import SingerApi from "../../api/singerApi";
import useFetching from "../../hooks/useFetching";
import Input from "../../shared/Input/Input";

const Singers = () => {
  const [singers, singersChange] = useState([]);
  const [name, nameChange] = useState("");
  const [description, descriptionChange] = useState("");
  const [changeableSinger, changeableSingerChange] = useState(null);

  const getCallback = async () => {
    const response = await SingerApi.get();
    singersChange(response.data);
  };

  const addCallback = async () => {
    if (!name) return;
    const prms = {
      name: name,
      description: description,
    };
    await SingerApi.add(prms);
    nameChange("");
    descriptionChange("");
    fetchGet();
  };

  const deleteCallback = async (id) => {
    await SingerApi.delete(id);
    fetchGet();
  };

  const changeCallback = async () => {
    if (!changeableSinger.name) return;
    const p = {
      name: changeableSinger.name,
      description: changeableSinger.description,
    };
    await SingerApi.change(changeableSinger.id, p);
    changeableSingerChange(null);
    fetchGet();
  };

  const [fetchGet] = useFetching(getCallback);
  const [fetchAdd] = useFetching(addCallback);
  const [fetchDelete] = useFetching(deleteCallback);
  const [fetchChange] = useFetching(changeCallback);

  const changeName = (value) =>
    changeableSingerChange({ ...changeableSinger, name: value });

  const changeDescription = (value) =>
    changeableSingerChange({ ...changeableSinger, description: value });

  useEffect(() => {
    fetchGet();
  }, []);

  return (
    <div>
      <h1>Исполнители</h1>
      <div className="container">
        <b>Добавить</b>
        <Input value={name} setValue={nameChange} text="Имя" />
        <Input
          value={description}
          setValue={descriptionChange}
          text="Описание"
        />
        <button onClick={fetchAdd}>Добавить</button>
      </div>
      {changeableSinger && (
        <div className="container">
          <b>Изменить</b>
          <Input
            value={changeableSinger.name}
            setValue={changeName}
            text="Имя"
          />
          <Input
            value={changeableSinger.description}
            setValue={changeDescription}
            text="Описание"
          />
          <button onClick={fetchChange}>Сохранить</button>
          <button onClick={() => changeableSingerChange()}>Отменить</button>
        </div>
      )}
      {singers.map((singer) => (
        <div
          key={singer.id}
          className={singer.id === changeableSinger?.id ? "selected" : ""}
        >
          <b>{singer.name}</b>
          <div>{singer.description}</div>
          <button onClick={() => changeableSingerChange(singer)}>
            Изменить
          </button>
          <button onClick={() => fetchDelete(singer.id)}>Удалить</button>
        </div>
      ))}
      {singers.length === 0 && <div>Список пуст</div>}
    </div>
  );
};

export default Singers;
