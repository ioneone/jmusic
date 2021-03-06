import React, { useEffect, useState } from 'react';
import { MusicJSON } from './APIManager';

type YoutubeVideoProps = {
  music: MusicJSON[],
  width: string,
  height: string,
  onReady: (event: any) => void,
  onStateChange: (event: any) => void,
  onCurrentTimeChange: (player: any) => void,
  loopCurrentSong: boolean
}

const YoutubeVideo = (props: YoutubeVideoProps) => {

  const { music, width, height, onReady, onStateChange, onCurrentTimeChange, loopCurrentSong } = props;

  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => { if (player && player.getCurrentTime) onCurrentTimeChange(player) }, 100); 
    return () => clearInterval(interval);
  }, [player, onCurrentTimeChange]);

  useEffect(() => {

    const loadVideo = () => {
  
      // the Player object is created uniquely based on the id in props
      // @ts-ignore
      setPlayer(new window.YT.Player("player", {
        width: width,
        height: height,
        events: {
          onReady: onReady,
          onStateChange: onStateChange
        }
      }));

    };

    // On mount, check to see if the API script is already loaded
    // @ts-ignore
    if (!window.YT) { // If not, load the script asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      // @ts-ignore
      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    } else { // If script is already there, load the video directly
      loadVideo();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (player && player.loadPlaylist) {
      if (loopCurrentSong) {
        player.loadPlaylist([music[player.getPlaylistIndex()].id]);
        player.setLoop(true);
      }
      else {
        player.loadPlaylist(music.map(m => m.id));
        player.setLoop(true);
      }
    }
  }, [loopCurrentSong, player, music]);

  return (
    <div id="player" />
  );

};

export default YoutubeVideo;