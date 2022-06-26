import { BaseEntity, Column, Entity, Index } from "typeorm";

type ExampleRow = { name: string; age: number; isMale: boolean };
@Index("examples_pkey", ["name"], { unique: true })
@Entity("examples", { schema: "public" })
export class Example extends BaseEntity {
	@Column("text", { primary: true, name: "name" })
	name;

	@Column("int")
	age;

	@Column("boolean")
	isMale;

	constructor({ age, name, isMale }: ExampleRow) {
		super();
		this.name = name;
		this.age = age;
		this.isMale = isMale;
	}
}
