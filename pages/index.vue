<script setup lang="ts">
import { useCollection } from "@/stores/collection";
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

const collection = useCollection();
const albums = await useAsyncData("content", async () => {
  // Use stored data
  if (await collection.check()) {
    return unref(collection.data);
  }

  // Call new data
  const entries = await getEntries({
    content_type: "album",
    order: ["-fields.releaseDate"],
    limit: 1000,
    locale: unref(locale),
  });

  // Store data
  await collection.set(entries);
  return entries;
});
</script>

<template>
  <div>
    <section>
      <div class="stretch">
        <div class="row">
          <div class="col col-12">
            <h1 class="title-1">{{ $t("albums.title") }}</h1>
            <ul class="mt2">
              <li
                v-for="album in albums.data.value.items as Album[]"
                :key="album.sys.id"
              >
                {{ album.fields.title }}
              </li>
            </ul>

            <MediaPlayer />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
