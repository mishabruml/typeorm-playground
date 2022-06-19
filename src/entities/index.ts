import { BaseEntity, Column, Entity, Index } from "typeorm";

@Index("examples_pkey", ["name"], { unique: true })
@Entity("examples", { schema: "public" })
export class Example extends BaseEntity {
	@Column("text", { primary: true, name: "name" })
	name: string;

	constructor(public params: { name: string }) {
		super();
		this.name = params.name;
	}
}
