import createFastContext from "./createFastContext";

const { Provider, useStore } = createFastContext({ first: "", last: "" });

const { Provider: Provider2, useStore: useStore2 } = createFastContext({
  age: 0,
});

useStore.subscribe((data) => {
  console.log("useStore", data);
});

useStore2.subscribe((data) => {
  console.log("useStore2", data);
});

const TextInput = ({ value }: { value: "first" | "last" }) => {
  const [fieldValue, setStore] = useStore((store) => store[value]);
  return (
    <div className="field">
      {value}:{" "}
      <input
        value={fieldValue}
        onChange={(e) => setStore({ [value]: e.target.value })}
      />
    </div>
  );
};

const TextInputAge = ({ value }: { value: "age" }) => {
  const [fieldValue, setStore] = useStore2((store) => store[value]);
  return (
    <div className="field">
      {value}:{" "}
      <input
        value={fieldValue}
        onChange={(e) =>
          setStore({ [value]: e.target.value as unknown as number })
        }
      />
    </div>
  );
};

const Display = ({ value }: { value: "first" | "last" }) => {
  const [fieldValue] = useStore((store) => store[value]);
  return (
    <div className="value">
      {value}: {fieldValue}
    </div>
  );
};

const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
      <TextInputAge value="age" />
    </div>
  );
};

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

function App() {
  return (
    <Provider>
      <Provider2>
        <div className="container">
          <h5>App</h5>
          <ContentContainer />
        </div>
      </Provider2>
    </Provider>
  );
}

export default App;
