import { renderHook, waitFor } from "@testing-library/react-native";
import { usePrayersQuery, usePushUpdate } from "@/hooks/usePrayersQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock expo-sqlite
const mockDb = {
  getAllAsync: jest.fn(),
  runAsync: jest.fn(),
};

jest.mock("expo-sqlite", () => ({
  useSQLiteContext: () => mockDb,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("usePrayersQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns prayers and totalDebt", async () => {
    mockDb.getAllAsync.mockResolvedValue([
      { vakit_id: "sabah", kalan_sayi: 100 },
      { vakit_id: "ogle", kalan_sayi: 50 },
    ]);

    const { result } = renderHook(() => usePrayersQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.prayers).toHaveLength(2);
    expect(result.current.data?.totalDebt).toBe(150);
  });
});

describe("usePushUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserts history log and updates prayer count", async () => {
    mockDb.runAsync.mockResolvedValue(undefined);

    const { result } = renderHook(() => usePushUpdate(), {
      wrapper: createWrapper(),
    });

    await result.current("sabah", 100, -1);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "INSERT INTO history_logs (tarih, islem, vakit_id) VALUES (?, ?, ?)",
      expect.arrayContaining([expect.any(String), -1, "sabah"]),
    );
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "UPDATE prayers SET kalan_sayi = ? WHERE vakit_id = ?",
      [99, "sabah"],
    );
  });

  it("prevents negative debt", async () => {
    mockDb.runAsync.mockResolvedValue(undefined);

    const { result } = renderHook(() => usePushUpdate(), {
      wrapper: createWrapper(),
    });

    await result.current("sabah", 0, -1);

    expect(mockDb.runAsync).not.toHaveBeenCalled();
  });
});
