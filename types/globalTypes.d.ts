import { Asset, AssetFields, EntryFieldTypes, EntrySys } from "contentful";

export type Song = {
  sys: EntrySys;
  fields: AssetFields;
};

export type Side = {
  sys: EntrySys;
  fields: {
    side: EntryFieldTypes.Text;
    vinyl?: Asset;
    label?: Asset;
    songs: Song[];
  };
};

export type ComposedSide = {
  url?: string;
  name?: string;
  lengths?: number[];
  lengthsCompounded?: number[];
  activeSong?: number;
};

export type Artist = {
  sys: EntrySys;
  fields: {
    artistName: EntryFieldTypes.Text;
    avatar: Asset;
  };
};

export type Album = {
  sys: EntrySys;
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    releaseDate?: EntryFieldTypes.Date;
    rpm: EntryFieldTypes.Number;
    size: EntryFieldTypes.Text;
    moodColor?: EntryFieldTypes.Text;
    albumCoverFront?: Asset;
    albumCoverBack?: Asset;
    albumCoverSide?: Asset;
    sides: Side[];
    artists: Artist[];
    miscellaneousInformation?: EntryFieldTypes.Text;
  };
};

export type AlbumByArtist = {
  sys: EntrySys;
  fields: {
    artistName: EntryFieldTypes.Text;
    avatar: Asset;
  };
  albums: Album[];
};
