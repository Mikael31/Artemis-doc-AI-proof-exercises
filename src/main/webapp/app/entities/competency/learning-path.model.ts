import { BaseEntity } from 'app/shared/model/base-entity';
import { Course } from 'app/entities/course.model';
import { User, UserNameAndLoginDTO } from 'app/core/user/user.model';
import { Competency } from 'app/entities/competency.model';
import { Edge, Node } from '@swimlane/ngx-graph';
import { faCheckCircle, faCircle, faFlag, faFlagCheckered, faPlayCircle, faSignsPost } from '@fortawesome/free-solid-svg-icons';

export class LearningPath implements BaseEntity {
    public id?: number;
    public progress?: number;
    public user?: User;
    public course?: Course;
    public competencies?: Competency[];

    constructor() {}
}

export class LearningPathInformationDTO {
    public id?: number;
    public user?: UserNameAndLoginDTO;
    public progress?: number;
}

export class NgxLearningPathDTO {
    public nodes: NgxLearningPathNode[];
    public edges: NgxLearningPathEdge[];
}

export class NgxLearningPathNode implements Node {
    public id: string;
    public type?: NodeType;
    public linkedResource?: number;
    public linkedResourceParent?: number;
    public completed?: boolean;
    public label?: string;
}

export function getIcon(node: NgxLearningPathNode) {
    // return generic icon if no type present
    if (!node.type) {
        return faCircle;
    }

    // return different icons for completed learning objects
    if (node.type === NodeType.EXERCISE || node.type === NodeType.LECTURE_UNIT) {
        if (node.completed) {
            return faCheckCircle;
        } else {
            return faPlayCircle;
        }
    }

    const icons = {
        [NodeType.COMPETENCY_START]: faFlag,
        [NodeType.COMPETENCY_END]: faFlagCheckered,
        [NodeType.MATCH_START]: faSignsPost,
        [NodeType.MATCH_END]: faCircle,
    };
    return icons[node.type];
}

export class NgxLearningPathEdge implements Edge {
    public id?: string;
    public source: string;
    public target: string;
}

export enum NodeType {
    COMPETENCY_START = 'COMPETENCY_START',
    COMPETENCY_END = 'COMPETENCY_END',
    MATCH_START = 'MATCH_START',
    MATCH_END = 'MATCH_END',
    EXERCISE = 'EXERCISE',
    LECTURE_UNIT = 'LECTURE_UNIT',
}
