import carols from './carols.json'
import type { Song } from '@christmas-carol/types'

export type CarolEntry = {
  id: string
  title: string
  artist: string
  lyrics: string
  chords?: string
}

export function getCarolLibrary(): CarolEntry[] {
  return carols as CarolEntry[]
}

export function carolToSong(carol: CarolEntry, addedBy: string): Omit<Song, 'id' | 'addedBy'> {
  return {
    title: carol.title,
    artist: carol.artist,
    lyrics: carol.lyrics,
    chords: carol.chords,
  }
}

export async function fetchLyrics(
  artist: string,
  title: string
): Promise<string | null> {
  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return data.lyrics ?? null
  } catch {
    return null
  }
}
