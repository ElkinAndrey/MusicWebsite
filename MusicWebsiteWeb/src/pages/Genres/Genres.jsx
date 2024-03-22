import React, { useEffect, useState } from "react";
import useFetching from "../../hooks/useFetching";
import GenreApi from "../../api/genreApi";
import Input from "../../shared/Input/Input";

const Genres = () => {
  const [genres, genresChange] = useState([]);
  const [name, nameChange] = useState("");
  const [changeableGenre, changeableGenreChange] = useState(null);

  const getCallback = async () => {
    const response = await GenreApi.get();
    genresChange(response.data);
  };

  const addCallback = async () => {
    if (!name) return;
    const prms = {
      name: name,
    };
    await GenreApi.add(prms);
    nameChange("");
    fetchGet();
  };

  const deleteCallback = async (id) => {
    await GenreApi.delete(id);
    fetchGet();
  };

  const changeCallback = async () => {
    if (!changeableGenre.name) return;
    const p = {
      name: changeableGenre.name,
    };
    await GenreApi.change(changeableGenre.id, p);
    changeableGenreChange(null);
    fetchGet();
  };

  const [fetchGet] = useFetching(getCallback);
  const [fetchAdd] = useFetching(addCallback);
  const [fetchDelete] = useFetching(deleteCallback);
  const [fetchChange] = useFetching(changeCallback);

  const changeName = (value) =>
    changeableGenreChange({ ...changeableGenre, name: value });

  useEffect(() => {
    fetchGet();
  }, []);

  return (
    <div>
      <h1>Жанры</h1>
      <div className="container">
        <b>Добавить</b>
        <Input value={name} setValue={nameChange} />
        <button onClick={fetchAdd}>Добавить</button>
      </div>
      {changeableGenre && (
        <div className="container">
          <b>Изменить</b>
          <Input value={changeableGenre.name} setValue={changeName} />
          <button onClick={fetchChange}>Сохранить</button>
          <button onClick={() => changeableGenreChange()}>Отменить</button>
        </div>
      )}
      {genres.map((genre) => (
        <div
          key={genre.id}
          className={genre.id === changeableGenre?.id ? "selected" : ""}
        >
          <label>{genre.name}</label>
          <button onClick={() => changeableGenreChange(genre)}>Изменить</button>
          <button onClick={() => fetchDelete(genre.id)}>Удалить</button>
        </div>
      ))}
      {genres.length === 0 && <div>Список пуст</div>}
    </div>
  );
};

export default Genres;
