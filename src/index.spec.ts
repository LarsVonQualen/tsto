import { expect, Test, TestSuite } from 'testyts';
import {
  tsto,
  tstoArray,
  tstoEnum,
  tstoFrom,
  tstoNumber,
  tstoObject,
  tstoString,
  TstoSubArrayElementType,
} from './';

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

@TestSuite()
export class TstoFromTests {
  @Test()
  simulation() {
    const expected = new TestDto('test4');
    expected.testString = 'test';
    expected.testNumber = 1;
    const grandChild = new GrandChild(
      TestEnum.FirstOption,
      TestEnum.SecondOption,
    );
    expected.testObject = new ChildObject(2, 'test2', 'test5', grandChild);
    const childObject = new ChildObject(3, 'test3', 'test6', grandChild);
    expected.testArray = [childObject];
    expected.testStringArray = ['test7', 'test8'];
    expected.testNumberArray = [4, 5];
    expected.testMultiDimensionalArray = [0, 'str', ['str1', 1, childObject]];

    const obj = {
      anotherTestString: 'test4',
      testString: 'test',
      testNumber: 1,
      testObject: {
        anotherTestString: 'test2',
        yetAnotherTestString: 'test5',
        grandChild: { testEnum: 1, anotherTestEnum: 'SecondOption' },
        anotherTestNumber: 2,
      },
      testArray: [
        {
          anotherTestString: 'test3',
          yetAnotherTestString: 'test6',
          grandChild: { testEnum: 1, anotherTestEnum: 'SecondOption' },
          anotherTestNumber: 3,
        },
      ],
      testStringArray: ['test7', 'test8'],
      testNumberArray: [4, 5],
      testMultiDimensionalArray: [
        0,
        'str',
        [
          'str1',
          1,
          {
            anotherTestString: 'test3',
            yetAnotherTestString: 'test6',
            grandChild: { testEnum: 1, anotherTestEnum: 'SecondOption' },
            anotherTestNumber: 3,
          },
        ],
      ],
    };

    const resultObj = tstoFrom(obj, TestDto);
    expect.toBeTrue(resultObj instanceof TestDto);
    expect.toBeTrue(resultObj?.testArray[0] instanceof ChildObject);
    expect.toBeEqual(
      JSON.stringify(resultObj),
      JSON.stringify(expected),
      JSON.stringify(
        {
          resultObj,
          expected,
        },
        undefined,
        2,
      ),
    );
  }
}
