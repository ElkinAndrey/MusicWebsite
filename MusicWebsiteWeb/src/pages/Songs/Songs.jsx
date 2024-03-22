import React, { useEffect, useState } from "react";
import SongApi from "../../api/songApi";
import useFetching from "../../hooks/useFetching";
import Input from "../../shared/Input/Input";
import InputNumber from "../../shared/InputNumber/InputNumber";
import GenreApi from "../../api/genreApi";
import Select from "../../shared/Select/Select";
import getTime from "../../utils/getTime";
import { Link } from "react-router-dom";

const Songs = () => {
  const [songs, songsChange] = useState([]);
  const [genres, genresChange] = useState([]);
  const [name, nameChange] = useState("");
  const [durationSecond, durationSecondChange] = useState(0);
  const [durationMinut, durationMinutChange] = useState(0);
  const [genre, genreChange] = useState(null);
  const [changeableSong, changeableSongChange] = useState(null);

  const getCallback = async () => {
    const response = await SongApi.get();
    songsChange(response.data);
  };

  const addCallback = async () => {
    if (!name) return;
    const prms = {
      name: name,
      duration: durationSecond + durationMinut * 60,
      genreId: genre,
    };
    await SongApi.add(prms);
    nameChange("");
    durationSecondChange(0);
    durationMinutChange(0);
    genreChange(genres[0]?.id);
    fetchGet();
  };

  const deleteCallback = async (id) => {
    await SongApi.delete(id);
    fetchGet();
  };

  const changeCallback = async () => {
    if (!changeableSong.name) return;
    const p = {
      name: changeableSong.name,
      duration:
        changeableSong.durationSecond + changeableSong.durationMinut * 60,
      genreId: changeableSong.genre,
    };
    await SongApi.change(changeableSong.id, p);
    changeableSongChange(null);
    fetchGet();
  };

  const getGenresCallback = async () => {
    const response = await GenreApi.get();
    genreChange(response.data[0]?.id);
    genresChange(response.data);
  };

  const [fetchGet] = useFetching(getCallback);
  const [fetchAdd] = useFetching(addCallback);
  const [fetchDelete] = useFetching(deleteCallback);
  const [fetchChange] = useFetching(changeCallback);
  const [fetchGetGenres] = useFetching(getGenresCallback);

  const changeName = (value) =>
    changeableSongChange({ ...changeableSong, name: value });

  const changeDurationSecond = (value) =>
    changeableSongChange({ ...changeableSong, durationSecond: value });

  const changeDurationMinut = (value) =>
    changeableSongChange({ ...changeableSong, durationMinut: value });

  const changeGenre = (value) =>
    changeableSongChange({ ...changeableSong, genre: value });

  const setСhangeableSong = (value) => {
    const prms = {
      id: value.id,
      name: value.name,
      durationSecond: value.duration - Math.floor(value.duration / 60) * 60,
      durationMinut: Math.floor(value.duration / 60),
      genre: value.genre.id,
    };
    changeableSongChange(prms);
  };

  useEffect(() => {
    fetchGet();
    fetchGetGenres();
  }, []);

  return (
    <div>
      <h1>Песни</h1>
      <div className="container">
        <b>Добавить</b>
        <Input value={name} setValue={nameChange} text="Имя" />
        <InputNumber
          value={durationSecond}
          setValue={durationSecondChange}
          min={0}
          max={60}
          text="Количество секунд"
        />
        <InputNumber
          value={durationMinut}
          setValue={durationMinutChange}
          min={0}
          max={60}
          text="Количество минут"
        />
        <Select
          values={genres.map((genre) => {
            return { value: genre.id, text: genre.name };
          })}
          value={genre}
          setValue={genreChange}
        />
        <button onClick={fetchAdd}>Добавить</button>
      </div>
      {changeableSong && (
        <div className="container">
          <b>Изменить</b>
          <Input value={changeableSong.name} setValue={changeName} text="Имя" />
          <InputNumber
            value={changeableSong.durationSecond}
            setValue={changeDurationSecond}
            min={0}
            max={60}
            text="Количество секунд"
          />
          <InputNumber
            value={changeableSong.durationMinut}
            setValue={changeDurationMinut}
            min={0}
            max={60}
            text="Количество минут"
          />
          <Select
            values={genres.map((genre) => {
              return { value: genre.id, text: genre.name };
            })}
            value={changeableSong.genre}
            setValue={changeGenre}
          />
          <button onClick={fetchChange}>Сохранить</button>
          <button onClick={() => changeableSongChange()}>Отменить</button>
        </div>
      )}
      {songs.map((song) => (
        <div
          key={song.id}
          className={song.id === changeableSong?.id ? "selected" : ""}
        >
          <Link to={`/${song.id}`}>
            <b>{song.name}</b>
          </Link>
          <div>{getTime(song.duration)}</div>
          <div>{song.genre.name}</div>
          <button onClick={() => setСhangeableSong(song)}>Изменить</button>
          <button onClick={() => fetchDelete(song.id)}>Удалить</button>
        </div>
      ))}
      {songs.length === 0 && <div>Список пуст</div>}
    </div>
  );
};

export default Songs;
