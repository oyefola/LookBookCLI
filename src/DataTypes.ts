export type MakeupItem = {
  type: string;
  brand: string;
  name: string;
  shade: string;
};
export type MakeupLook = {
  name: string;
  components: MakeupItem[];
};
