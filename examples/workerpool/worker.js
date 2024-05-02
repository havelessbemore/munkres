import workerpool from "workerpool";

import { matchAsync } from "../../dist/munkres.mjs";

workerpool.worker({ match: matchAsync });
