import { expect, Test, TestSuite } from 'testyts';
import {
  tsto,
  tstoArray,
  tstoFrom,
  tstoNumber,
  tstoObject,
  tstoString,
} from './';

@tsto()
export class GrandChild {}

@tsto()
export class ChildObject {
  @tstoNumber()
  anotherTestNumber!: number;

  constructor(
    @tstoString() public anotherTestString: string,
    @tstoString() public yetAnotherTestString: string,
    @tstoObject(GrandChild) public grandChild: GrandChild,
  ) {}

  testFn() {}
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

  constructor(@tstoString() public anotherTestString: string) {}
}

@TestSuite()
export class TstoFromTests {
  @Test()
  simulation() {
    const expected = new TestDto('test4');
    expected.testString = 'test';
    expected.testNumber = 1;
    const grandChild = new GrandChild();
    expected.testObject = new ChildObject('test2', 'test5', grandChild);
    expected.testObject.anotherTestNumber = 2;
    const childObject = new ChildObject('test3', 'test6', grandChild);
    childObject.anotherTestNumber = 3;
    expected.testArray = [childObject];
    expected.testStringArray = ['test7', 'test8'];
    expected.testNumberArray = [4, 5];

    const obj = {
      anotherTestString: 'test4',
      testString: 'test',
      testNumber: 1,
      testObject: {
        anotherTestString: 'test2',
        yetAnotherTestString: 'test5',
        grandChild: {},
        anotherTestNumber: 2,
      },
      testArray: [
        {
          anotherTestString: 'test3',
          yetAnotherTestString: 'test6',
          grandChild: {},
          anotherTestNumber: 3,
        },
      ],
      testStringArray: ['test7', 'test8'],
      testNumberArray: [4, 5],
    };

    const resultObj = tstoFrom(obj, TestDto);
    expect.toBeTrue(resultObj instanceof TestDto);
    // expect.toBeTrue(resultObj?.testArray[0] instanceof ChildObject);
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
