import { getData, postData } from "@/utils/request";
import { Person } from "./types";

export const getPerson = () => getData("/testVue",{});
