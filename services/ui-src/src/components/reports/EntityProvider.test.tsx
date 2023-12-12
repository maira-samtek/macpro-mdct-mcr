import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext, useEffect } from "react";
// utils
import { useStore } from "utils";
// components
import { EntityContext, EntityProvider } from "components";
import { mockEntityStore } from "utils/testing/mockZustand";

const testEntities = [
  {
    id: "foo",
  },
  {
    id: "bar",
  },
];

const testEntitiesUpdated = [
  {
    id: "foo",
    test: "update",
  },
  {
    id: "bar",
  },
];

interface Props {
  noEntity?: boolean;
}

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockEntityStore);

const TestComponent = (props: Props) => {
  const { prepareEntityPayload } = useContext(EntityContext);

  useEffect(() => {
    mockEntityStore.setEntities(testEntities);
    if (!props.noEntity) {
      mockEntityStore.setSelectedEntity({ id: "foo" });
    }
  }, [mockEntityStore.setEntities, mockEntityStore.setSelectedEntity]);

  return (
    <div>
      <button onClick={() => prepareEntityPayload({ test: "update" })}>
        Update Entities
      </button>
      <p id="entities">{JSON.stringify(testEntities)}</p>
      <p>{testEntities.length}</p>
    </div>
  );
};

const testComponent = (
  <EntityProvider>
    <TestComponent noEntity={false} />
  </EntityProvider>
);

const testComponentNoEntity = (
  <EntityProvider>
    <TestComponent noEntity={true} />
  </EntityProvider>
);

describe("Test update entities provider function", () => {
  test("Should update entities if the selected entity is valid", async () => {
    const result = await render(testComponent);
    expect(
      await result.container.querySelector("[id='entities']")?.innerHTML
    ).toMatch(JSON.stringify(testEntities));
    const updateButton = await result.findByText("Update Entities");
    await userEvent.click(updateButton);

    setTimeout(async () => {
      expect(
        await result.container.querySelector("[id='entities']")?.innerHTML
      ).toMatch(JSON.stringify(testEntitiesUpdated));
    }, 500);
  });

  test("Should do nothing if the selected entity is not set", async () => {
    const result = render(testComponentNoEntity);
    expect(
      await result.container.querySelector("[id='entities']")?.innerHTML
    ).toMatch(JSON.stringify(testEntities));
    const updateButton = await result.findByText("Update Entities");
    await userEvent.click(updateButton);

    setTimeout(async () => {
      expect(
        await result.container.querySelector("[id='entities']")?.innerHTML
      ).toMatch(JSON.stringify(testEntities));
    }, 500);
  });
});
