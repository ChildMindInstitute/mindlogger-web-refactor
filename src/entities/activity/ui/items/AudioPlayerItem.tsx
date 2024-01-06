import Box from "@mui/material/Box"

import { AudioPlayerItem as AudioPlayerItemType } from "../../lib/types/item"

import { AudioPlayerItemBase } from "~/shared/ui"

type Props = {
  item: AudioPlayerItemType
}

export const AudioPlayerItem = ({ item }: Props) => {
  const isAbleToPlayOnce = item.config.playOnce

  return (
    <Box display="flex" justifyContent="center" data-testid="audio-player-item">
      <AudioPlayerItemBase src={item.responseValues.file} playOnce={isAbleToPlayOnce} />
    </Box>
  )
}
