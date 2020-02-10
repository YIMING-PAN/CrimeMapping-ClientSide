import { api_url } from "./config";

export async function register(email, password) {
  const response = await fetch(api_url + "/register", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password
    }),
    headers: {
      "Content-type": "application/json"
    }
  });

  const result = await response.json();

  if (response.ok) {
    return result["message"];
  } else {
    throw new Error(result["message"]);
  }
}

export async function login(email, password) {
  const response = await fetch(api_url + "/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password
    }),
    headers: {
      "Content-type": "application/json"
    }
  });

  // console.log(response);

  const result = await response.json();

  // console.log(result);

  if (response.ok) {
    return result.token;
  } else {
    throw new Error(result.message);
  }
}

export async function getOffences() {
  const response = await fetch(api_url + "/offences");

  const result = await response.json();
  if (response.ok) {
    return result["offences"];
  } else {
    throw new Error("Unknown error");
  }
}

export async function getAreas() {
  const response = await fetch(api_url + "/areas");

  const result = await response.json();
  if (response.ok) {
    return result["areas"];
  } else {
    throw new Error("Unknown error");
  }
}

export async function getGenders() {
  const response = await fetch(api_url + "/genders");

  const result = await response.json();
  if (response.ok) {
    return result["genders"];
  } else {
    throw new Error("Unknown error");
  }
}

export async function getYears() {
  const response = await fetch(api_url + "/years");

  const result = await response.json();
  if (response.ok) {
    return result["years"];
  } else {
    throw new Error("Unknown error");
  }
}

export async function getAges() {
  const response = await fetch(api_url + "/ages");

  const result = await response.json();
  if (response.ok) {
    return result["ages"];
  } else {
    throw new Error("Unknown error");
  }
}

export async function search(token, offence, filters) {
  // let token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0NTgzLCJlbWFpbCI6InRlc3QifSwiaWF0IjoxNTU4NTczNjk0LCJleHAiOjE1NTg2NjAwOTR9.wqOEBIf9o5NROToBpmrE-urHwqPUoNzAm0fcPLrm8Bw";

  let url = new URL(api_url + "/search");
  url.searchParams.append("offence", offence);

  if (filters) {
    for (let name of ["area", "age", "gender", "year", "month"]) {
      if (filters[name]) {
        url.searchParams.append(name, filters[name]);
      }
    }
  }

  console.log(url);

  let param = {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  };

  const response = await fetch(url, param);

  const result = await response.json();

  if (response.ok) {
    return result["result"];
  } else {
    throw new Error(result.message);
  }
}
