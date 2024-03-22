import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SongApi from "../../api/songApi";
import useFetching from "../../hooks/useFetching";
import SingerApi from "../../api/singerApi";

function contains(id, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return true;
  }
  return false;
}

const Song = () => {
  const params = useParams();
  const [song, songChange] = useState(null);
  const [singers, singersChange] = useState([]);
  const [notSingers, notSingersChange] = useState([]);

  const getByIdCallback = async () => {
    const response = await SongApi.getById(params.id);
    songChange(response.data);
  };

  const getSingersCallback = async () => {
    const responseMember = await SongApi.getSingers(params.id);
    const responseAll = await SingerApi.get();
    const data = responseAll.data.filter(
      (s) => !contains(s.id, responseMember.data)
    );
    singersChange(responseMember.data);
    notSingersChange(data);
  };

  const deleteSingerCallback = async (singerId) => {
    await SongApi.deleteSinger(params.id, singerId);
    fetchGetSingers();
  };

  const addSingerCallback = async (singerId) => {
    await SongApi.addSinger(params.id, singerId);
    fetchGetSingers();
  };

  const [fetchGetById] = useFetching(getByIdCallback);
  const [fetchGetSingers] = useFetching(getSingersCallback);
  const [fetchDeleteSinger] = useFetching(deleteSingerCallback);
  const [fetchAddSinger] = useFetching(addSingerCallback);

  useEffect(() => {
    fetchGetById();
    fetchGetSingers();
  }, [params]);

  if (!song) return <></>;

  return (
    <div>
      <h1>Песня</h1>
      <div>{song.name}</div>
      <div>{song.duration}</div>
      <div>{song.genre.name}</div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "20px" }}>
          <h2>Исполнители песни</h2>
          {singers.map((singer) => (
            <div key={singer.id}>
              <label>{singer.name}</label>
              <button onClick={() => fetchDeleteSinger(singer.id)}>
                Выгнать
              </button>
            </div>
          ))}
        </div>
        <div>
          <h2>Остальные исполнители</h2>
          {notSingers.map((singer) => (
            <div key={singer.id}>
              <label>{singer.name}</label>
              <button onClick={() => fetchAddSinger(singer.id)}>
                Добавить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Song;
