<script setup lang="ts">
import { Asset, EntrySys, EntryFieldTypes } from "contentful";

// Locales
const localePath = useLocalePath();
const { t, locale } = useI18n();

// Contentful
const { getEntries } = useContentful();

type Album = {
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
  };
};

const albums = await useAsyncData("content", async () => {
  return await getEntries({
    content_type: "album",
    order: ["-fields.releaseDate"],
    limit: 1000,
    locale: unref(locale),
  });
});
</script>

<template>
  <div>
    <h1>Vinylab</h1>
    <h2>{{ $t("albums.title") }}</h2>
    <ul>
      <li
        v-for="album in albums.data.value.items as Album[]"
        :key="album.sys.id"
      >
        {{ album.fields.title }}
      </li>
    </ul>
  </div>
</template>
