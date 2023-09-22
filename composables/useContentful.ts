import {
  EntriesQueries,
  Entry,
  EntryCollection,
  EntrySkeletonType,
} from "contentful";
import { createSharedComposable } from "@vueuse/core";

export type SkeletonCollection<SKELETON extends EntrySkeletonType> =
  EntryCollection<SKELETON>;
export type SkeletonEntry<SKELETON extends EntrySkeletonType> = Entry<SKELETON>;
export type UseContentfulReturn<SKELETON extends EntrySkeletonType> = {
  getEntries: (
    query: EntriesQueries<SKELETON, any>,
  ) => Promise<SkeletonCollection<SKELETON>>;
};

export function useContentfulService<
  SKELETON extends EntrySkeletonType,
>(): UseContentfulReturn<SKELETON> {
  const { $contentfulClient } = useNuxtApp();

  async function getEntries(
    query: EntriesQueries<SKELETON, any>,
  ): Promise<SkeletonCollection<SKELETON>> {
    const entries = (await $contentfulClient.getEntries<SKELETON>(
      query,
    )) as SkeletonCollection<SKELETON>;

    return entries;
  }

  return {
    getEntries,
  };
}

export const useContentful = createSharedComposable(useContentfulService);
