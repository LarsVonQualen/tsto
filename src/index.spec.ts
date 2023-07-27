import { tsto } from './internal/tsto';
import { tstoFrom } from './internal/tsto-from.fn';
import { tstoNumber } from './internal/tsto-number';
import { tstoObject } from './internal/tsto-object';
import { tstoString } from './internal/tsto-string';
import { Test, TestSuite, expect } from 'testyts';

@tsto()
export class ChildObject {
  @tstoString()
  anotherTestString!: string;

  @tstoNumber()
  anotherTestNumber!: number;
}

@tsto()
export class TestDto {
  @tstoString()
  testString!: string;

  @tstoNumber()
  testNumber!: number;

  @tstoObject(ChildObject)
  testObject!: ChildObject;
}

@TestSuite()
export class TstoTests {
  @Test()
  tstoFrom_happy_path() {
    const expected = new TestDto();
    expected.testString = 'test';
    expected.testNumber = 1;
    expected.testObject = new ChildObject();
    expected.testObject.anotherTestString = 'test2';
    expected.testObject.anotherTestNumber = 2;

    const obj = {
      testString: 'test',
      testNumber: 1,
      testObject: {
        anotherTestString: 'test2',
        anotherTestNumber: 2,
      },
    };
    const json = JSON.stringify(obj);

    const resultObj = tstoFrom(obj, TestDto);
    expect.toBeEqual(
      JSON.stringify(resultObj),
      JSON.stringify(expected),
      'resultObj',
    );

    const resultJson = tstoFrom(json, TestDto);
    expect.toBeEqual(
      JSON.stringify(resultJson),
      JSON.stringify(expected),
      'resultJson',
    );
  }
}
