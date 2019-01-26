import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Habits {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    userid: string;

    @Column('date')
    created: Date;

    @Column('integer')
    target: number;

    @Column('text')
    description: string;

    @Column('text')
    title: string;
}
