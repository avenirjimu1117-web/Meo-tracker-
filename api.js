// GAS Web App(順位トラッカーのバックエンド)と通信するための薄いラッパー
// VercelのEnvironment Variablesに VITE_GAS_API_URL を設定してください
// (例: https://script.google.com/macros/s/xxxxxxxx/exec)

const BASE_URL = import.meta.env.VITE_GAS_API_URL;

function assertConfigured() {
  if (!BASE_URL) {
    throw new Error(
      'VITE_GAS_API_URL が設定されていません。VercelのEnvironment VariablesにGASウェブアプリのURLを追加してください。'
    );
  }
}

export async function getSettings() {
  assertConfigured();
  const res = await fetch(`${BASE_URL}?action=getSettings`);
  if (!res.ok) throw new Error('設定の取得に失敗しました');
  return res.json();
}

export async function getHistory({ storeId, days } = {}) {
  assertConfigured();
  const params = new URLSearchParams({ action: 'getHistory' });
  if (storeId) params.set('storeId', storeId);
  if (days) params.set('days', days);
  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('順位履歴の取得に失敗しました');
  return res.json();
}

// GASのCORSプリフライト回避のため text/plain で送信し、
// 本文はJSON文字列として自前でパースしてもらう構成
async function postAction(body) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('リクエストに失敗しました');
  return res.json();
}

export const addKeyword = (storeId, keyword) =>
  postAction({ action: 'addKeyword', storeId, keyword });

export const toggleKeyword = (keywordId, enabled) =>
  postAction({ action: 'toggleKeyword', keywordId, enabled });

export const updateStore = (storeId, fields) =>
  postAction({ action: 'updateStore', storeId, fields });

export const runCheckNow = () => postAction({ action: 'runCheckNow' });
