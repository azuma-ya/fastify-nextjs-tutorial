interface Options<T = object> {
  params?: T;
  headers?: HeadersInit;
  credentials?: Request["credentials"];
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

interface CustomResponse<T> {
  data: T;
  headers: Headers;
  status: number;
  statusText: string;
  config: RequestInit;
  request: Request;
}

/** 絶対URLかどうかを判定する　*/
function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/** URLとパスを連結する */
function combineUrls(baseURL: string, relativeURL: string): string {
  return relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}`
    : baseURL;
}

/** URLを構築する */
function buildFullPath(baseURL: string, requestedURL: string): string {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineUrls(baseURL, requestedURL);
  }
  return requestedURL;
}

/** リクエストヘッダを構築する */
function buildHeaders<T = HeadersInit>(headers?: T): HeadersInit {
  // Content-TypeとAuthorizationは接続前の初期化値として必ず設定しておく
  return {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    ...headers,
  };
}

/**
 * ローカル環境以外はセキュリティのためcredentialsをデフォルト値("same-origin")とする
 * @see https://developer.mozilla.org/ja/docs/Web/API/Request/credentials
 */
function buildCredentials(
  credentials?: Request["credentials"]
): Request["credentials"] | undefined {
  if (process.env.NODE_ENV === "development") {
    credentials = undefined;
  }
  return credentials;
}

/** リクエストボディを構築する */
function buildRequestBody<T = object>(body: T): string | FormData | null {
  // FormDataの場合、 `JSON.stringify()` せずそのまま返す
  if (body instanceof FormData) return body;

  // bodyがnull,undefinedの場合はnullを返して終了する
  // JSON.stringifyにnullを渡すとエラーになるため
  if (!body) return null;

  return JSON.stringify(body);
}

/** クエリパラメータ付きのURLパスを構築する */
function buildPathWithSearchParams<T = object>(path: string, params?: T) {
  // パラメータがない場合、URLパスをそのまま返す
  if (!params || Object.keys(params).length === 0) return path;

  for (const key in params) {
    if (params[key] === undefined) {
      // URLSearchParamsで`key="undefined"`になるので削除する
      delete params[key];
    }
  }

  const urlSearchParams = new URLSearchParams(params);
  return `${path}?${urlSearchParams.toString()}`;
}

/** 通信処理を共通化した関数 */
async function http<T>(
  path: string,
  config: RequestInit
): Promise<CustomResponse<T>> {
  const request = new Request(
    // NEXT_PUBLIC_API_ROOTは必ず値が存在する想定なので `!` で型エラーを回避する
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    // Docker環境のため
    typeof window === "undefined"
      ? buildFullPath(process.env.NEXT_PUBLIC_API_URL!, path)
      : `/api/${path}`,
    config
  );

  const res: Response = await fetch(request);

  if (!res.ok) {
    throw new Error(
      `HTTP Error! status: ${res.status}\n${res.statusText || ""}`
    );
  }

  // statusCodeが204のときにres.json()を実行するとエラーになるため
  if (res.status === 204) {
    throw new Error(
      `HTTP Error! status: ${res.status}\n${res.statusText || ""}`
    );
  }

  const data = await res.json();

  return {
    data,
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
    config,
    request,
  };
}

export async function get<T, U = object>(
  path: string,
  options?: Options<U>
): Promise<CustomResponse<T>> {
  return http<T>(
    buildPathWithSearchParams(
      path,
      options?.params ? options.params : undefined
    ),
    {
      headers: buildHeaders(options?.headers),
      credentials: buildCredentials(options?.credentials),
      cache: options?.cache,
      next: options?.next,
    }
  );
}

export async function post<T, U, V = object>(
  path: string,
  body: T,
  options?: Options<V>
): Promise<CustomResponse<U>> {
  return http<U>(path, {
    method: "POST",
    body: buildRequestBody(body),
    headers: buildHeaders(options?.headers),
    credentials: buildCredentials(options?.credentials),
    cache: options?.cache,
    next: options?.next,
  });
}

export async function put<T, U, V = object>(
  path: string,
  body: T,
  options?: Options<V>
): Promise<CustomResponse<U>> {
  return http<U>(path, {
    method: "PUT",
    body: buildRequestBody(body),
    headers: buildHeaders(options?.headers),
    credentials: buildCredentials(options?.credentials),
    cache: options?.cache,
    next: options?.next,
  });
}

export async function destroy<T, U = object>(
  path: string,
  options?: Options<U>
): Promise<CustomResponse<T>> {
  return http<T>(
    buildPathWithSearchParams(
      path,
      options?.params ? options.params : undefined
    ),
    {
      method: "DELETE",
      headers: buildHeaders(options?.headers),
      credentials: buildCredentials(options?.credentials),
      cache: options?.cache,
      next: options?.next,
    }
  );
}

export const fw = { get, post, put, destroy };
