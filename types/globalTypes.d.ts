import { Asset, AssetFields, EntryFieldTypes, EntrySys } from "contentful";

export type Song = {
  sys: EntrySys;
  fields: AssetFields;
};

export type Side = {
  sys: EntrySys;
  fields: {
    name: EntryFieldTypes.Text;
    songs: Song[];
  };
};

export type Artist = {
  sys: EntrySys;
  fields: {
    name: EntryFieldTypes.Text;
    avatar: Asset;
  };
};

export type Album = {
  sys: EntrySys;
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    releaseDate?: EntryFieldTypes.Date;
    rpm: EntryFieldTypes.Text;
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
