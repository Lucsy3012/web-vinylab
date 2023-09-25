<script setup lang="ts">
import { useCollection } from "@/stores/collection";
import { useSelected } from "@/stores/selected";
import { Album } from "~~/types/globalTypes";

// Locales
const localePath = useLocalePath();
const { t, locale } = useI18n();

// Contentful
const { getEntries } = useContentful();

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

// Selecting album
const selected = useSelected();
function selectAlbum(album: Album) {
  selected.setAlbum(album);
}
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
                @click="selectAlbum(album)"
                :key="album.sys.id"
              >
                {{ album.fields.title }}
              </li>
            </ul>

            <MediaPlayer :key="selected.side?.sys?.id ?? 'default'" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
