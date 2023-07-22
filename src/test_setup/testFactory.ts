import { UserData } from "../Interfaces.ts";
import { Factory } from "rosie";

export const UserDataFactory = {
  build: (overrides = {} as UserData | NonNullable<unknown>): UserData => {
    return Factory.build("UserDataFactory", overrides);
  },
};

Factory.define<UserData>("UserDataFactory").attrs({
  gender: "male",
  name: {
    title: "Mr",
    first: "Michael",
    last: "Williams",
  },
  email: "test@test.com",
  phone: "123456789",
  cell: "123123123",
  id: {
    name: "test",
    value: "123123123",
  },
  picture: {
    large: "123123123",
    medium: "123123123",
    thumbnail: "123123123",
  },
});
