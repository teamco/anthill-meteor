import { IMetadata, IUser, TWidget } from "/imports/config/types"

export class EmptyWidget implements TWidget {
  name: string = "Empty";
  description: string = "Empty widget";
  thumbnail: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE1klEQVR4Xu1ay07rVhS1j4MhgFRVqtRRO+EDQGJa2glCICSG3H5JJ5132Fn7Ex0yQapuRwxB6CImlao7QaLilYS87MSvrhV5RyduGxvk64TYR1raO9sxOWvtfR4c24yiyChzU0AlQJlRCVAJUAlQCVAJUGbU9MDx8fFnT09P7zzP+y6+NgQ80zSHURTRT2KglBrQ4rrL7wFuEASMO7C85tJnvFarObZtu/f39875+bk3DwKMd4JHR0ffNJvN947j2IV2wDRpotiPAPpiQ0BsiBgtEcAXG4DDyCJO+GIJxL34mkeEYfih0+n8dHV11ZwQ4ODg4PeHh4ddowQNgjTB+0tWoZKg7/tbRkkayH8O7NBX8di3IcAXRrmaPZ4EUfpKv7K7u2tsbW2NfIwZXTndik/Id1le8jlp5TvJmNyn308k/5Ygeb98lvuTvzHhn52dGTc3N4lVIIGdnR1jc3NTCOikiLS4IId4/r99cXGReR8gM7RkI2tckEM859+WCkwKUCIRyCNVAJIgFk0E4kVb4UUTgfdnHgIklKcI9GctglRB5iGQpwiMz1oEWUYzD4GFFUFvtQxjXwiJr8eJXOJayxwXsvpGLAgC2mnDOlUAndTcikCivu8TQppI+x/gRRUwdyLQDgYDYzgcjoi/omWeBHUiM50TmFUSbrfbBs4rjH6//0ry2TdCQnKmInieZ+Dgwmi1Wka32yXpQs8ESaJwEZhtx3GYaWacmRexc0b6EChUBGb7+fl5RLzX68lklifS9wFFVwJnbpJtNBokX0S2yeFFO8HcRZBZnOOaxDmhUYhZNjVFrTxE4OTFSYykefLEsc2SnxXfbEMA5/acjJgtZojk0kSQJYvkeC8J8+8w0yx1lvj8PxgR3N3dkcCkUkoZlmUZeLhBn2SJsUC089rSt8LpEMJFlm/xq0BJHoqUWoCqApJQJct+JUA1CVaTYDUJllKASoBqFahWgWoV+M9nB7V5L1meLxA8mxDLswVageu6OngeQcsTJ7HipzwYybfD0lHG2BGJyWGLWL3D9AkeovAaRfhU4v6tC8AXCkMZEre3t8b19bWusN5hUZOf6U90+C00y7L+wDuCHyZelNzb2/sLx1cbb24dVyoCfMCLX9UdAA5ifVzuwaftwtLvwv/T9/33SNwlRAjHQ2B5efnnpaWlX1CuRc/IzEgIPyCJ+P1jF9Zh50kk7niPFgnrINaB30GM5MKXigae2zAfgeZYgJOTk1/39/e/xVngOyiUtfO0AhLwYUliCN8h0OEerKjPTHQQayPWgv8Uk4gKXgojGPWvSfD09PT7w8PD31AeP0CErxDySCJWvxOTaAMtxBsg8ojsPcLOy+BndlW9XieslZUVC5U9hm3bFuYr//Ly8hEcAl0AeWPcDoLgI05+fwSxTFUA8p8qSxyWanV11dLIKI0MoUDY0oHEmNO2Anj85jKBugBC3sT4/xoCKI4NksursVNra2t6ZpQQEiIACQghhSSwH/9HJiBeWSEuuFEAP1kBdZR9QPLTyEB1c319nZkZgWRIRBBnZQwSQTWpKSSKmnWl/0OYhl4Bsk2MoMyI/MbGhrW9vV2PyZgxERNQWomFMd5UQ5L8mGeg7wN0iDArxmK2EOinbYUDwDEWuKUJEAFBdSJUgvYPTFvpcZflZF0AAAAASUVORK5CYII=";
  dimensions: {
    width: number;
    height: number;
  };
  content: {
    type: "Internal"
    value: string;
  };
  category: string = "regular";
  resource: string = "empty";
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: ''
  };

  constructor(widget: TWidget,user: IUser) {
    this.create(widget, user);
  }

  create(widget: TWidget, user?: IUser): void {
    this.name= widget?.name ?? this.name;
    this.description= widget?.description ?? this.description;
    this.thumbnail= widget?.thumbnail ?? this.thumbnail;

    this.dimensions = { width: widget?.dimensions?.width ?? 100, height: widget?.dimensions?.height ?? 100 };
    this.content = { type: "Internal", value: widget?.content?.value ?? "" };

    this.metadata = {
      ...this.metadata,
      createdBy: user?._id,
      updatedBy: user?._id
    }
  }
}