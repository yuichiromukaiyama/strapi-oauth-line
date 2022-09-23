"use strict";

/**
 * A set of functions for JCV
 * [API]
 * - add user
 * - update user
 * - remove user
 * - add guest
 * - update guest
 * - remove guest
 * [DATABASE]
 * - uid = LINEID（注意：LINEユーザーデータポリシーに基づき、複数プロバイダー間で発行されたLINEIDを結合する行為は禁止である。参考：https://terms2.line.me/LINE_Developers_user_data_policy?lang=ja）
 * - id = JCV ID
 *
 */
//@ts-check
const FormData = require("form-data");
const Readable = require("stream").Readable;
const axios = require("axios");
const crypto = require("crypto");
const { factories } = require("@strapi/strapi");

// TODO:テンプレートとしてDBに登録しておく（次ここから）
// 　　　service はほぼ固定フォーマットとして置いておく。
//      event だけ生やしていく処理を追加する --> そこまで厳密にしなくとも良い。このファイル1つを固定で表現する
// TODO:JCV系のカスタムコンポーネント追加に際してフラグの追加を要する

const JCV_BASE_API = "https://link.japancv.co.jp/api";

/**
 * JCV API に対するの認証情報を生成する。env.APP_KEY と env.SECRET は事前に JCV 管理コンソールより取得する
 * @param {URLSearchParams} searchParams
 * @returns {URLSearchParams}
 */
function jcvAuthentication(searchParams) {
  const appKey = process.env.APP_KEY;
  const secret = process.env.SECRET;
  const timestamp = new Date().getTime().toString();
  const md5 = crypto.createHash("md5");
  const sign = md5.update(`${timestamp}#${secret}`, "binary").digest("hex");
  searchParams.append("app_key", appKey);
  searchParams.append("timestamp", timestamp);
  searchParams.append("sign", sign);
  return searchParams;
}

/**
 * JCV の API に対してリクエストを行う
 * @param {string} path
 * @param {URLSearchParams} urlSearchParams
 * @param {FormData} data
 * @returns {Promise<any>}
 */
function postRequest(path, urlSearchParams, data) {
  const url = new URL([JCV_BASE_API, path].join("/"));
  url.search = urlSearchParams.toString();
  return axios({ method: "post", url: url.href, headers: { ...data.getHeaders() }, data });
}

module.exports = factories.createCoreController("api::test.test", ({ strapi }) => ({
  /**
   * ユーザーを登録する。JCVへのフォームパラメーターとLINE IDを受け取る。
   * @param {koa.Context} ctx
   */
  addUser: async (ctx) => {
    try {
      // check if registered
      strapi.entityService.findMany("api::test.test", {
        fields: ["uid"],
        filters: { uid: ctx.body.uid },
      });

      // 先にStrapiの認証をしていなければならない その認証IDを取得してサーバーから取得する
      // LINE にてログインできるか？

      // vars
      const PATH = "v2/user";
      const urlSearchParams = jcvAuthentication(new URLSearchParams());
      const body = ctx.request.body;
      const data = new FormData();
      // add file of face image
      const fileData = body.avatarFile.replace(/^data:\w+\/\w+;base64,/, "");
      const buf = Readable.from(Buffer.from(fileData, "base64"));
      data.append("avatarFile", buf, "image.png"); // ファイル名は固定
      data.append("groups", "");
      delete body.avatarFile;
      // add other property
      const keys = Object.keys(body);
      for (const key of keys) {
        data.append(key, body[key]);
      }
      // write user id to strapi database when success request to jcv
      await postRequest(PATH, urlSearchParams, data)
        .then((res) => {
          console.log("user id", res.body.data.id);
          strapi.entityService.ctx.body = { message: res.status };
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    } catch (err) {
      ctx.status = 404;
      ctx.body = err;
    }
  },
  updateUser: async (ctx) => {},
  removeUser: async (ctx) => {},
  addGuest: async (ctx) => {},
  updateGuest: async (ctx) => {},
  removeGuest: async (ctx) => {},
}));
