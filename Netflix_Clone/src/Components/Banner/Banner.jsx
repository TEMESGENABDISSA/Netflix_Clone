import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import requests from "../../utils/requests";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
import "./Banner.css";

const Banner = () => {
  const [movie, setMovie] = useState({});
  const [trailerUrl, setTrailerUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const request = await axios.get(requests.fetchNetflixOriginals);
        setMovie(
          request.data.results[
            Math.floor(Math.random() * request.data.results.length)
          ]
        );
      } catch (error) {
        console.log("error fetching banner movie", error);
      }
    })();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handlePlay = async () => {
    if (!movie) return;

    if (trailerUrl) {
      setTrailerUrl(""); // close if trailer open
      setErrorMsg("");
    } else {
      try {
        const name = movie?.name || movie?.title || movie?.original_name || "";

        if (!name) {
          setErrorMsg("Trailer not available");
          return;
        }

        const url = await movieTrailer(name, { id: true });

        if (!url) {
          setErrorMsg("Trailer not found for this movie");
          return;
        }

        setTrailerUrl(url);
        setErrorMsg("");
      } catch (error) {
        console.log("No trailer found", error);
        setErrorMsg("Trailer not found");
      }
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div
      className="banner"
      style={{
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <h1 className="banner__description">
            {truncate(movie?.overview, 150)}
          </h1>
          <button className="banner__button play" onClick={handlePlay}>
            {trailerUrl ? "Close" : "Play"}
          </button>
          <button className="banner__button">My List</button>
        </div>

        {/* Show trailer if available */}
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>
      <div className="banner__fadeBottom" />
    </div>
  );
};

export default Banner;
