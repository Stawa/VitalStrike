import { useState } from "react";
import { Switch } from "~/components/Switch";
import { WORLD_NAME, type Worlds } from "~/utils/configTypes";

const box =
  "rounded-xl bg-surface px-3 py-2 text-[15px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

export function WorldsEditor({
  value,
  onChange,
  id,
}: Readonly<{ value: Worlds; onChange: (next: Worlds) => void; id: string }>) {
  const [name, setName] = useState("");
  const names = Object.keys(value);
  const taken = names.some((n) => n.toLowerCase() === name.toLowerCase());
  const valid = WORLD_NAME.test(name) && !taken;

  const set = (world: string, patch: Partial<Worlds[string]>) =>
    onChange({ ...value, [world]: { ...value[world]!, ...patch } });

  const remove = (world: string) => {
    const next = { ...value };
    delete next[world];
    onChange(next);
  };

  const add = () => {
    if (!valid) return;
    onChange({ ...value, [name]: { enabled: true, "damage-multiplier": 1 } });
    setName("");
  };

  return (
    <div>
      <p className="rounded-xl bg-raised p-3.5 text-[14px] leading-relaxed text-muted-foreground">
        Add a world by the name of its folder on the server. Its settings win over the dimension
        settings (overworld, nether, end). A multiplier of 2 doubles damage; turning a world off
        switches VitalStrike off there.
      </p>

      {names.length === 0 && (
        <p className="mt-4 text-[15px] text-muted-foreground">No custom worlds yet.</p>
      )}

      <ul className="mt-4 space-y-3">
        {names.map((world) => {
          const setting = value[world]!;
          const label = `${id}-${world}`;
          return (
            <li
              key={world}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-2xl bg-raised p-4"
            >
              <span
                id={`${label}-name`}
                className="min-w-0 break-all font-mono text-[15px] font-semibold"
              >
                {world}
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <span id={`${label}-on`}>Active</span>
                  <Switch
                    checked={setting.enabled}
                    onChange={(enabled) => set(world, { enabled })}
                    labelledBy={`${label}-on`}
                  />
                </span>
                <label className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  Damage ×
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    value={setting["damage-multiplier"]}
                    onChange={(e) => {
                      const n = e.target.valueAsNumber;
                      if (!Number.isNaN(n)) set(world, { "damage-multiplier": n });
                    }}
                    aria-describedby={`${label}-name`}
                    className={`${box} w-24 text-right`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => remove(world)}
                  className="text-sm font-semibold text-primary-500 hover:underline"
                  aria-label={`Remove world ${world}`}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value.replace(/\s/g, ""))}
          placeholder="World name, e.g. arena"
          aria-label="New world name"
          aria-invalid={name !== "" && !valid}
          className={`${box} min-w-0 flex-1 bg-raised font-mono ${
            name !== "" && !valid ? "ring-2 ring-primary-500" : ""
          }`}
        />
        <button
          type="submit"
          disabled={!valid}
          className="h-11 rounded-full bg-raised px-6 text-[15px] font-semibold hover:opacity-80 disabled:opacity-50"
        >
          Add world
        </button>
      </form>
      {name !== "" && !valid && (
        <p className="mt-2 text-[14px] text-primary-500">
          {taken
            ? "That world is already in the list."
            : "Use letters, numbers, dashes and underscores only."}
        </p>
      )}
    </div>
  );
}
