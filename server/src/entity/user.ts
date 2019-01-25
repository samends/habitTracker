import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    username: string;

    @Column('text')
    password: string;
}
