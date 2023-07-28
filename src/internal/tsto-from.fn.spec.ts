import { tsto } from './tsto';
import { tstoFrom } from './tsto-from.fn';
import { tstoNumber } from './tsto-number';
import { tstoObject } from './tsto-object';
import { tstoObjectArray } from './tsto-object-array';
import { tstoString } from './tsto-string';
import { Test, TestSuite, expect } from 'testyts';

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

  @tstoObjectArray(ChildObject)
  testArray!: ChildObject[];

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

    const obj = {
      testString: 'test',
      testNumber: 1,
      testObject: {
        anotherTestString: 'test2',
        anotherTestNumber: 2,
      },
      testArray: [{ anotherTestNumber: 3, anotherTestString: 'test3' }],
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
