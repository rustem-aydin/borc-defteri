import { act, renderHook, waitFor } from "@testing-library/react-native";
import {
  PRAYERS_KEY,
  PrayersData,
  usePrayersQuery,
  usePushUpdate,
} from "@/hooks/usePrayersQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock expo-sqlite
const mockDb = {
  getAllAsync: jest.fn(),
  runAsync: jest.fn(),
  withTransactionAsync: jest.fn(),
};

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => mockDb,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return { queryClient, wrapper };
};

const seedCache = (queryClient: QueryClient) => {
  const data: PrayersData = {
    prayers: [
      { vakit_id: "sabah", kalan_sayi: 100 },
      { vakit_id: "ogle", kalan_sayi: 50 },
    ],
    totalDebt: 150,
  };
  queryClient.setQueryData(PRAYERS_KEY, data);
  return data;
};

describe("usePrayersQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reads only the displayed columns and sums the debt", async () => {
    mockDb.getAllAsync.mockResolvedValue([
      { vakit_id: "sabah", kalan_sayi: 100 },
      { vakit_id: "ogle", kalan_sayi: 50 },
    ]);

    const { wrapper } = createWrapper();
    const { result } = await renderHook(() => usePrayersQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      "SELECT vakit_id, kalan_sayi FROM prayers",
    );
    expect(result.current.data?.prayers).toHaveLength(2);
    expect(result.current.data?.totalDebt).toBe(150);
  });
});

describe("usePushUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.runAsync.mockResolvedValue(undefined);
    mockDb.withTransactionAsync.mockImplementation(async (fn: () => unknown) => {
      await fn();
    });
  });

  it("writes the log and an atomic increment inside one transaction", async () => {
    const { queryClient, wrapper } = createWrapper();
    seedCache(queryClient);

    const { result } = await renderHook(() => usePushUpdate(), { wrapper });
    await act(async () => {
      await result.current("sabah", -1);
    });

    expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "INSERT INTO history_logs (tarih, islem, vakit_id) VALUES (?, ?, ?)",
      expect.arrayContaining([expect.any(String), -1, "sabah"]),
    );
    // Sayaç JS'te hesaplanıp yazılmaz: aynı satırda atomik artırılır.
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "UPDATE prayers SET kalan_sayi = MAX(0, kalan_sayi + ?) WHERE vakit_id = ?",
      [-1, "sabah"],
    );
  });

  it("reflects the new count in the cache before the DB write finishes", async () => {
    const { queryClient, wrapper } = createWrapper();
    seedCache(queryClient);

    let releaseTransaction: () => void = () => {};
    mockDb.withTransactionAsync.mockImplementation(() => {
      const { promise, resolve } = Promise.withResolvers<void>();
      releaseTransaction = resolve;
      return promise;
    });

    const { result } = await renderHook(() => usePushUpdate(), { wrapper });
    const pending = result.current("sabah", -1);

    const cached = queryClient.getQueryData<PrayersData>(PRAYERS_KEY);
    expect(cached?.prayers).toEqual([
      { vakit_id: "sabah", kalan_sayi: 99 },
      { vakit_id: "ogle", kalan_sayi: 50 },
    ]);
    expect(cached?.totalDebt).toBe(149);

    await act(async () => {
      releaseTransaction();
      await pending;
    });
  });

  it("does not write when the debt is already zero", async () => {
    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(PRAYERS_KEY, {
      prayers: [{ vakit_id: "sabah", kalan_sayi: 0 }],
      totalDebt: 0,
    });

    const { result } = await renderHook(() => usePushUpdate(), { wrapper });
    await act(async () => {
      await result.current("sabah", -1);
    });

    expect(mockDb.withTransactionAsync).not.toHaveBeenCalled();
    expect(mockDb.runAsync).not.toHaveBeenCalled();
  });

  it("invalidates the history screen as well as the home queries", async () => {
    const { queryClient, wrapper } = createWrapper();
    seedCache(queryClient);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = await renderHook(() => usePushUpdate(), { wrapper });
    await act(async () => {
      await result.current("sabah", -1);
    });

    const keys = invalidateSpy.mock.calls.map((call) => call[0]?.queryKey);
    expect(keys).toEqual(
      expect.arrayContaining([
        PRAYERS_KEY,
        ["weeklyHistory"],
        ["lastPrayer"],
        ["history"],
      ]),
    );
  });
});
