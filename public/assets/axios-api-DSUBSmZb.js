import{u as e,A as t}from"./index-DOcY17eO.js";const o=e(),a=t.create({baseURL:"http://localhost:8000/api"});a.interceptors.response.use(s=>s,s=>(s.response&&s.response.status===401&&o.logout(),Promise.reject(s)));export{a};
