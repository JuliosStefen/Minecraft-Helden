export let dummyIds = {}
export function dummyId(name, id) {

    return {
        setId() {

            dummyIds[name] = id;
        },
        removeId() {

            delete dummyIds[name]
        },
        getId() {

            return dummyIds[name];
        }
    };
}