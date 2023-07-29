# tsto - Typescript Transfer Objects

![Build status](https://github.com/larsvonqualen/tsto/actions/workflows/ci.yml/badge.svg?branch=main)

![Latest NPM version](https://img.shields.io/npm/v/tsto)

## Before using the library

Make sure you remember to add the following to your `tsconfig.json` file in order for decorators to work:

```json
{
  "compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
    // ...
  }
}
```

## What is this even?

When you're working with Typescript, sometimes you want to be able to take input in a non-typesafe way, eg. when working with dynamic objects at runtime. The use case I've encountered was api endpoints, where I was tired of using plain types, and not having any control when using the input sent through the endpoint. In this case I would like to be able to fail early if the supplied json will not fit into a class of my choosing.

You could solve this by creating custom mappers, but because we're using Typescript, decorators is the obvious choice. By using decorators we only need to create a class and annotate the properties properly. This will probably make the most sense at the edges of you application, where you have some interface to the outside world.

## Example

Consider the following example (I know, there's a lot going on, but bear with me):

```typescript
// test.dto.ts
import {
  tsto,
  tstoArray,
  tstoFrom,
  tstoNumber,
  tstoObject,
  tstoString,
  TstoSubArrayElementType,
} from 'tsto';

enum TestEnum {
  FirstOption = 1,
  SecondOption = 2,
}

@tsto()
export class GrandChild {
  constructor(
    @tstoEnum(TestEnum) public testEnum: TestEnum,
    @tstoEnum(TestEnum, { useStringsAsInput: true })
    public anotherTestEnum: TestEnum,
  ) {}
}

@tsto()
export class ChildObject {
  constructor(
    @tstoNumber() public anotherTestNumber: number,
    @tstoString() public anotherTestString: string,
    @tstoString() public yetAnotherTestString: string,
    @tstoObject(GrandChild) public grandChild: GrandChild,
  ) {}
}

@tsto()
export class TestDto {
  @tstoString()
  testString!: string;

  @tstoNumber()
  testNumber!: number;

  @tstoObject(ChildObject)
  testObject!: ChildObject;

  @tstoArray(ChildObject)
  testArray!: ChildObject[];

  @tstoArray('string')
  testStringArray!: string[];

  @tstoArray('number')
  testNumberArray!: number[];

  @tstoArray([
    'number',
    'string',
    TstoSubArrayElementType.create(['string', 'number', ChildObject]),
  ])
  testMultiDimensionalArray!: [number, string, [string, number, ChildObject]];

  constructor(@tstoString() public anotherTestString: string) {}
}

// my-controller.ts
import { tstoFrom } from 'tsto';

class MyController {
  @get()
  get(body: TestDto) {
    // ^^^^^^^^^^^^ Here body is not yet actually the TestDto class, it's just syntactic sugar.
    // That's why we parse it through tsto, so that we get a proper instance of TestDto to work with.
    const testDto = tstoFrom(body, TestDto);
    // ^^^^^^^^^^^^ Here we have a proper instance of TestDto.
    // ...
  }
}
```

Alright! Now that you've studied the example, let's take a look at all the different decorators.

| Decorator | Short explanation |
| --- | --- |
| `@tsto()` | Simple class decorator that indicates that it's a `tsto` object. |
| `@tstoEnum(EnumType, options?)` | Indicates the property is an enum |
| `@tstoNumber(options?)` | Indicates the property is a number. |
| `@tstoString(options?)` | Indicates the property is a string. |
| `@tstoObject(MyObjectType, options?)` | Indicates the property is of an object type. |
| `@tstoArray(arrayTypeDefinition, options?)` | The most complex type of them all, tries to model arrays types. |

## Options

Each decorator takes an options object, that at the moment is quite barebones:

```typescript
{
  nullable?: boolean;
  undefineable?: boolean;
}
```

## Enums

For enums there's an extra option `useStringsAsInput`. Sometimes you will get strings as input for enums instead of integers, this will handle that.

That means options for `@tstoEnum` is:

```typescript
{
  nullable?: boolean;
  undefineable?: boolean;
  useStringsAsInput?: boolean;
}
```

## Arrays

At the moment the library fully supports primitive arrays of `string` and `number` types. When using arrays you will be able to make an `arrayTypeDefinition`, it's basically an array of what to expect. This comes with some rather big caveats when mixing types.

The simple usage is `string`, `number` or `object` based arrays:

```typescript
@tstoArray('string')
@tstoArray('number')
@tstoArray(MyObjectType)
```

That's fairly straight forward. But once you start mixing in different types aka. tuples for instance, it gets really complicated. But it can be defined like this:

```typescript
// Simple tuple
@tstoArray(['string', MyObjectType])
```

At the moment the library will not expect in specific order, and thus will try to match whatever is in the array to both types. That also means that only a single object type is supported at the moment.
